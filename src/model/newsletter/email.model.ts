import { model, models, Schema } from 'mongoose'
import { EmailMatchRegex } from '@/lib/utils'

const emailSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Please provide an email'],
      match: [EmailMatchRegex, 'Please provide a valid email'],
      index: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id
      },
    },
  }
)

const Email = models.email || model('email', emailSchema)

export default Email
