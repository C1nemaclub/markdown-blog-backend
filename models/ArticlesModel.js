const mongoose = require('mongoose');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    sanitizedHtml: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

articleSchema.pre('validate', function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  }

  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const isoDate = currentDate.toISOString().substring(0, 10);
  const day = isoDate.split('-')[2];
  const year = isoDate.split('-')[0];
  this.date = `${month} ${day}, ${year}`;

  next();
});

module.exports = mongoose.model('Article', articleSchema);
