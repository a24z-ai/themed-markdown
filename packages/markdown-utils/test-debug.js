const { parseMarkdownIntoPresentation } = require('./dist/index.js');

const content = `# First Slide

Some content here

\`\`\`markdown
# This is inside a code block
## So is this
Should not trigger a slide split
\`\`\`

Still in first slide

## Second Slide

This should be a new slide`;

const presentation = parseMarkdownIntoPresentation(content);
console.log('Number of slides:', presentation.slides.length);
presentation.slides.forEach((slide, i) => {
  console.log(`Slide ${i}: "${slide.title}"`);
  console.log('Content preview:', slide.location.content.substring(0, 50) + '...');
});
