import mongoose, { Schema, Document } from 'mongoose';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplaintCategory =
  | 'Roads'
  | 'Water'
  | 'Electricity'
  | 'Healthcare'
  | 'Sanitation'
  | 'Safety';

export interface IComplaint extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  imageUrl?: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedToId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        'Roads',
        'Water',
        'Electricity',
        'Healthcare',
        'Sanitation',
        'Safety',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint =
  mongoose.models.Complaint ||
  mongoose.model<IComplaint>('Complaint', complaintSchema);