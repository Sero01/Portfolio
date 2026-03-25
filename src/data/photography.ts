export interface Photo {
  id: number;
  src: string;
  alt: string;
  caption?: string;
}

export const photos: Photo[] = [
  { id: 1, src: "", alt: "Photo 1", caption: "Caption one" },
  { id: 2, src: "", alt: "Photo 2", caption: "Caption two" },
  { id: 3, src: "", alt: "Photo 3", caption: "Caption three" },
  { id: 4, src: "", alt: "Photo 4", caption: "Caption four" },
  { id: 5, src: "", alt: "Photo 5", caption: "Caption five" },
  { id: 6, src: "", alt: "Photo 6", caption: "Caption six" },
];
