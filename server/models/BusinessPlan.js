import mongoose from 'mongoose';

const businessPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    idea: {
      type: String,
      required: [true, 'Business idea is required'],
      trim: true,
    },
    targetMarket: {
      type: String,
      required: true,
      trim: true,
    },
    revenueModel: {
      type: String,
      required: true,
      trim: true,
    },
    fundingStage: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      trim: true,
    },
    generatedReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    marketReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    financialReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    pitchDeck: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    validationReport: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BusinessPlan = mongoose.model('BusinessPlan', businessPlanSchema);

export default BusinessPlan;
