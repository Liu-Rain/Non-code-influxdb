export type Row = {
  time: string;
  start: string;
  stop: string;
  measurement: string;
  room: string;
  value: number;
  field: "co" | "temp" | "hum";
  label: "Carbon Dioxide Level" | "Temperature" | "Humidity";
  Kitchen?: number;
  "Living Room"?: number;
};
