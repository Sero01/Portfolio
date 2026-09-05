const state = {
  data: null,
  router: "rules",
  layer: 3,
  threshold: 0,
  focusIndex: 0,
  timer: null,
};

const elements = {
  threshold: document.querySelector("#threshold"),
  thresholdValue: document.querySelector("#threshold-value"),
  messageTabs: document.querySelector("#message-tabs"),
  messageId: document.querySelector("#message-id"),
  messageSlice: document.querySelector("#message-slice"),
  messageSubject: document.querySelector("#message-subject"),
  messageSender: document.querySelector("#message-sender"),
  messageBody: document.querySelector("#message-body"),
  goldAction: document.querySelector("#gold-action"),
  proposalDsl: document.querySelector("#proposal-dsl"),
  traceList: document.querySelector("#trace-list"),
  outcomePill: document.querySelector("#outcome-pill"),
  playStream: document.querySelector("#play-stream"),
  riskChart: document.querySelector("#risk-chart"),
  ablationBars: document.querySelector("#ablation-bars"),
};

function percent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function goldDsl(message) {
  const args = Object.entries(message.gold_args)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join(", ");
  return `${message.gold_intent}(${args})`;
}

function alwaysEscalateProposal(message) {
  return {
    ...message,
    proposal_dsl: 'ESCALATE(reason="control: always escalate")',
    proposed: "ESCALATE",
    proposed_args: { reason: "control: always escalate" },
    tier: "escalate",
    valid: true,
    is_escalation: true,
    confidence: 0,
    proposal_correct: message.gold_escalate,
    injection_suspected: false,
  };
}

function proposalFor(message) {
  return state.router === "escalate"
    ? alwaysEscalateProposal(message)
    : message;
}

function decide(message, threshold = state.threshold) {
  const proposal = proposalFor(message);
  const layers = {
    validator: state.layer >= 1,
    tier: state.layer >= 2,
    injection: state.layer >= 3,
  };

  if (layers.injection && proposal.injection_suspected) {
    return { executed: false, code: "Injection blocked", stage: "injection" };
  }
  if (proposal.is_escalation) {
    return { executed: false, code: "Model escalated", stage: "model" };
  }
  if (layers.validator && !proposal.valid) {
    return { executed: false, code: "Malformed rejected", stage: "validator" };
  }
  if (proposal.confidence < threshold) {
    return { executed: false, code: "Below global gate", stage: "confidence" };
  }
  if (
    layers.tier &&
    proposal.tier === "gated" &&
    proposal.confidence < state.data.meta.gated_policy_threshold
  ) {
    return { executed: false, code: "Policy blocked", stage: "policy" };
  }
  return {
    executed: true,
    code: proposal.proposal_correct ? "Mock executed" : "Unsafe executed",
    stage: "execute",
  };
}

function scoreAll(threshold = state.threshold) {
  let executed = 0;
  let correct = 0;
  let unsafe = 0;
  let unsafeAdversarial = 0;
  let wrongExecuted = 0;

  state.data.messages.forEach((message) => {
    const proposal = proposalFor(message);
    const decision = decide(message, threshold);
    if (decision.executed) {
      executed += 1;
      if (proposal.proposal_correct) {
        correct += 1;
      } else {
        wrongExecuted += 1;
      }
      if (message.gold_escalate) {
        unsafe += 1;
        unsafeAdversarial += Number(message.slice === "adversarial");
      }
    } else if (message.gold_escalate) {
      correct += 1;
    }
  });

  const total = state.data.messages.length;
  return {
    coverage: executed / total,
    accuracy: correct / total,
    unsafe,
    unsafeAdversarial,
    risk: executed ? wrongExecuted / executed : 0,
  };
}

function renderMetrics() {
  const metrics = scoreAll();
  document.querySelector("#metric-coverage").textContent = percent(metrics.coverage);
  document.querySelector("#metric-accuracy").textContent = percent(metrics.accuracy);
  document.querySelector("#metric-unsafe").textContent = metrics.unsafe;
  document.querySelector("#metric-unsafe-detail").textContent =
    `${metrics.unsafeAdversarial} adversarial / should-escalate rows`;
  document.querySelector("#metric-risk").textContent = percent(metrics.risk);
}

function traceStep(index, title, detail, status, tone = "") {
  return `
    <li class="trace-step ${tone}">
      <span class="trace-index">${String(index).padStart(2, "0")}</span>
      <div>
        <strong>${title}</strong>
        <p>${detail}</p>
      </div>
      <span class="trace-state">${status}</span>
    </li>
  `;
}

function renderTrace(message) {
  const proposal = proposalFor(message);
  const decision = decide(message);
  const layerNames = ["Off", "On", "On", "On"];
  const validatorOn = state.layer >= 1;
  const tierOn = state.layer >= 2;
  const injectionOn = state.layer >= 3;
  const confidencePass = proposal.confidence >= state.threshold;
  const policyPass =
    proposal.tier !== "gated" ||
    proposal.confidence >= state.data.meta.gated_policy_threshold;
  const unsafe = decision.executed && message.gold_escalate;

  const trace = [
    traceStep(
      1,
      "Router proposal",
      `Proposed <code>${proposal.proposed}</code> at ${(proposal.confidence * 100).toFixed(0)}% confidence.`,
      proposal.is_escalation ? "Declined" : "Emitted",
    ),
    traceStep(
      2,
      "Typed DSL validator",
      validatorOn
        ? `Schema is ${proposal.valid ? "valid" : "invalid"}; closed enums and message-id checked.`
        : "Layer removed for ablation; malformed output would pass.",
      validatorOn ? (proposal.valid ? "Pass" : "Blocked") : layerNames[0],
      validatorOn && !proposal.valid ? "blocked" : "",
    ),
    traceStep(
      3,
      "Global confidence gate",
      `Score ${(proposal.confidence * 100).toFixed(0)}% vs threshold ${(state.threshold * 100).toFixed(0)}%.`,
      confidencePass ? "Pass" : "Blocked",
      confidencePass ? "" : "blocked",
    ),
    traceStep(
      4,
      "Tier policy",
      tierOn
        ? `Tier <code>${proposal.tier}</code>; archive floor is 70%.`
        : "Layer removed for ablation; every valid tier may execute.",
      tierOn ? (policyPass ? "Pass" : "Blocked") : "Off",
      tierOn && !policyPass ? "blocked" : "",
    ),
    traceStep(
      5,
      "Content-trust defense",
      injectionOn
        ? proposal.injection_suspected
          ? "Message body contains instruction-like markers."
          : "No explicit injection markers detected."
        : "Layer removed; message content is treated as trusted.",
      injectionOn
        ? proposal.injection_suspected
          ? "Blocked"
          : "Pass"
        : "Off",
      injectionOn && proposal.injection_suspected ? "blocked" : "",
    ),
    traceStep(
      6,
      "Mock executor",
      decision.executed
        ? unsafe
          ? "Action is structurally valid—but wrong for this message."
          : "Action matches the human label."
        : `Refused at ${decision.stage}; no inbox mutation occurs.`,
      decision.executed ? (unsafe ? "Unsafe" : "Executed") : "Escalated",
      unsafe ? "danger" : decision.executed ? "" : "blocked",
    ),
  ];

  elements.traceList.innerHTML = trace.join("");
  elements.proposalDsl.textContent = proposal.proposal_dsl;
  elements.outcomePill.textContent = decision.code;
  elements.outcomePill.className = "outcome-pill";
  if (unsafe) {
    elements.outcomePill.classList.add("unsafe");
  } else if (!decision.executed) {
    elements.outcomePill.classList.add("blocked");
  }
}

function renderMessage() {
  const focusId = state.data.meta.focus_ids[state.focusIndex];
  const message = state.data.messages.find((item) => item.id === focusId);
  elements.messageId.textContent = `Message id · ${message.message.id}`;
  elements.messageSlice.textContent = message.slice;
  elements.messageSlice.className = `slice-badge ${message.slice}`;
  elements.messageSubject.textContent = message.message.subject;
  elements.messageSender.textContent = `From · ${message.message.sender}`;
  elements.messageBody.textContent = message.message.body;
  elements.goldAction.textContent = goldDsl(message);

  document.querySelectorAll(".message-tab").forEach((tab, index) => {
    tab.classList.toggle("active", index === state.focusIndex);
  });
  renderTrace(message);
}

function renderTabs() {
  elements.messageTabs.innerHTML = state.data.meta.focus_ids
    .map((id, index) => {
      const message = state.data.messages.find((item) => item.id === id);
      return `
        <button
          class="message-tab ${index === state.focusIndex ? "active" : ""}"
          data-index="${index}"
          data-slice="${message.slice}"
          title="${message.message.subject}"
        >${String(index + 1).padStart(2, "0")}</button>
      `;
    })
    .join("");
  elements.messageTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.focusIndex = Number(button.dataset.index);
      renderMessage();
    });
  });
}

function renderAblations() {
  const maxUnsafe = Math.max(...state.data.ablations.map((row) => row.unsafe));
  elements.ablationBars.innerHTML = state.data.ablations
    .map(
      (row) => `
        <div class="ablation-row">
          <span>${row.name}</span>
          <div class="ablation-track">
            <div
              class="ablation-fill"
              style="width:${maxUnsafe ? (row.unsafe / maxUnsafe) * 100 : 0}%"
            ></div>
          </div>
          <span class="ablation-value">${row.unsafe} unsafe</span>
        </div>
      `,
    )
    .join("");
}

function svgElement(name, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function renderChart() {
  const svg = elements.riskChart;
  svg.innerHTML = "";
  const bounds = { left: 58, right: 690, top: 20, bottom: 276 };
  const points = Array.from({ length: 21 }, (_, index) => {
    const threshold = index / 20;
    return { threshold, ...scoreAll(threshold) };
  });
  const maxRisk = Math.max(0.15, ...points.map((point) => point.risk));
  const x = (coverage) =>
    bounds.left + coverage * (bounds.right - bounds.left);
  const y = (risk) =>
    bounds.bottom - (risk / maxRisk) * (bounds.bottom - bounds.top);

  [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
    const xPos = x(tick);
    svg.appendChild(
      svgElement("line", {
        x1: xPos,
        y1: bounds.top,
        x2: xPos,
        y2: bounds.bottom,
        stroke: "#303831",
        "stroke-width": 1,
      }),
    );
    const label = svgElement("text", {
      x: xPos,
      y: 302,
      fill: "#7e887f",
      "font-size": 10,
      "text-anchor": "middle",
    });
    label.textContent = `${tick * 100}%`;
    svg.appendChild(label);
  });

  [0, 0.5, 1].forEach((tick) => {
    const risk = maxRisk * tick;
    const yPos = y(risk);
    svg.appendChild(
      svgElement("line", {
        x1: bounds.left,
        y1: yPos,
        x2: bounds.right,
        y2: yPos,
        stroke: "#303831",
        "stroke-width": 1,
      }),
    );
    const label = svgElement("text", {
      x: 47,
      y: yPos + 4,
      fill: "#7e887f",
      "font-size": 10,
      "text-anchor": "end",
    });
    label.textContent = percent(risk);
    svg.appendChild(label);
  });

  const path = points
    .map(
      (point, index) =>
        `${index ? "L" : "M"} ${x(point.coverage)} ${y(point.risk)}`,
    )
    .join(" ");
  svg.appendChild(
    svgElement("path", {
      d: path,
      fill: "none",
      stroke: "#d5ff4c",
      "stroke-width": 3,
      "stroke-linejoin": "round",
    }),
  );

  const selected = scoreAll(state.threshold);
  svg.appendChild(
    svgElement("circle", {
      cx: x(selected.coverage),
      cy: y(selected.risk),
      r: 7,
      fill: "#58e8ff",
      stroke: "#101310",
      "stroke-width": 3,
    }),
  );

  const xLabel = svgElement("text", {
    x: (bounds.left + bounds.right) / 2,
    y: 319,
    fill: "#939b94",
    "font-size": 10,
    "text-anchor": "middle",
  });
  xLabel.textContent = "Local coverage →";
  svg.appendChild(xLabel);
}

function renderAll() {
  elements.thresholdValue.textContent = state.threshold.toFixed(2);
  renderMetrics();
  renderMessage();
  renderChart();
}

function cycleMessage(delta = 1) {
  const total = state.data.meta.focus_ids.length;
  state.focusIndex = (state.focusIndex + delta + total) % total;
  renderMessage();
}

function toggleStream() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
    elements.playStream.innerHTML = "<span>▶</span> Play stream";
    return;
  }
  state.timer = setInterval(() => cycleMessage(1), 3200);
  elements.playStream.innerHTML = "<span>Ⅱ</span> Pause";
}

function bindControls() {
  document.querySelectorAll("#router-control button").forEach((button) => {
    button.addEventListener("click", () => {
      state.router = button.dataset.router;
      document
        .querySelectorAll("#router-control button")
        .forEach((item) => item.classList.toggle("active", item === button));
      renderAll();
    });
  });

  document.querySelectorAll("#layer-control button").forEach((button) => {
    button.addEventListener("click", () => {
      state.layer = Number(button.dataset.layer);
      document
        .querySelectorAll("#layer-control button")
        .forEach((item) => item.classList.toggle("active", item === button));
      renderAll();
    });
  });

  elements.threshold.addEventListener("input", () => {
    state.threshold = Number(elements.threshold.value);
    renderAll();
  });
  document
    .querySelector("#previous-message")
    .addEventListener("click", () => cycleMessage(-1));
  document
    .querySelector("#next-message")
    .addEventListener("click", () => cycleMessage(1));
  elements.playStream.addEventListener("click", toggleStream);
}

async function boot() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`data request failed: ${response.status}`);
    }
    state.data = await response.json();
    renderTabs();
    renderAblations();
    bindControls();
    renderAll();
  } catch (error) {
    document.querySelector("main").innerHTML = `
      <section class="thesis panel">
        <p class="eyebrow">Demo data unavailable</p>
        <blockquote>Serve <em>demo/</em> over HTTP.</blockquote>
        <p>Run <code>python3 -m http.server 8000 --directory demo</code>, then open localhost:8000.</p>
      </section>
    `;
    console.error(error);
  }
}

boot();
