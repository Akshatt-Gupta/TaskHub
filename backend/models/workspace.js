import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const workspaceSchema = new Schema({
  name: {
    type:String,
    required: true,
    trim:true,
  },
  description:{type:String,trim:true},
  color:{
    type:String,
    default:"FF5733",
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  members:[
    {
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["owner","admin","member","viewer",],
            default:"member",
        },
        joinedAt:{
            type:Date,
            default:Date.now,
        },
    },
  ],
  projects:[
    { type:
        Schema.Types.ObjectId,
        ref:"Project",
    },
  ]

},{timestamps:true,});

const Workspace = mongoose.model("Workspace",workspaceSchema);
export default Workspace;
