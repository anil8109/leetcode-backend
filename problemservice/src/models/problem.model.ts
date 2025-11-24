import mongoose, { Document } from "mongoose";

export interface ITestCase {
    input: string;
    output: string
}

export interface IProblem extends Document {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testCases: ITestCase[];
}

const testcaseSchema = new mongoose.Schema<ITestCase>({
    input: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true
    }
}, {
    _id: false
});

const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title must be less than 100 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, "Difficulty is required"]
    },
    editorial: {
        type: String,
        required: false,
        trim: true
    },
    testCases: [testcaseSchema]
}, {
    timestamps: true
});

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const ProblemModel = mongoose.model<IProblem>("Problem", problemSchema);