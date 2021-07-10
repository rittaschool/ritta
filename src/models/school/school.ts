// User that logs in.
// Account's also have names on top users.

import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

interface School extends mongoose.Document {
  name: string;
  address: string;
  postal: string;
  website?: string;
  principal?: {
    name: string;
    phone: string;
    email: string;
  };
  vicePrincipal?: {
    name: string;
    phone: string;
    email: string;
  };
  schoolSecretary?: {
    name: string;
    phone: string;
    email: string;
  };
  lessonLength: number;
  lessonTimes: {
    start: string;
    end: string;
  }[];
}

const school = new mongoose.Schema<School>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  principal: {
    type: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  vicePrincipal: {
    type: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  schoolSecretary: {
    type: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  lessonLength: {
    type: Number,
    default: 45,
  },
  lessonTimes: {
    type: [
      {
        start: {
          type: String,
          required: true,
        },
        end: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
});

school.plugin(uniqueValidator);

export default mongoose.model<School>('School', school);
