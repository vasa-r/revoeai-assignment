import mongoose, { Schema } from "mongoose";

interface ITable extends Document {
  tableName: string;
  userId: Schema.Types.ObjectId;
  googleSheetId: string;
}

const tableSchema = new Schema<ITable>(
  {
    tableName: {
      type: String,
      required: [true, "Table name is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    googleSheetId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Table =
  mongoose.models.Table || mongoose.model<ITable>("Table", tableSchema);

export default Table;
