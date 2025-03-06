import mongoose, { Schema } from "mongoose";

interface IColumn extends Document {
  columnName: string;
  columnType: "Text" | "Date";
  isDynamic: boolean;
  rows: { value: string | Date; createdAt: Date }[];
  tableId: Schema.Types.ObjectId;
}

const rowSchema = new Schema(
  {
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const columnSchema = new Schema<IColumn>(
  {
    columnName: {
      type: String,
      required: [true, "Column name is required"],
    },
    columnType: {
      type: String,
      enum: ["Text", "Date"],
      default: "Text",
    },
    isDynamic: {
      type: Boolean,
      default: false,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    rows: [rowSchema],
  },
  { timestamps: true }
);

const Column =
  mongoose.models.Column || mongoose.model<IColumn>("Column", columnSchema);

export default Column;
