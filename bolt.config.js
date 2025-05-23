module.exports = {
  name: "Antd Template",
  description: "A starter template for ant design app",
  prompts: [
    {
      name: "projectName",
      message: "What is your project name?",
      default: "my-app",
    },
    {
      name: "balaji",
      message: "balaji selvaraj",
    }
  ],
  actions: [
    {
      type: "modify",
      files: ["package.json"],
      handler: (data, content) => {
        return content.replace(/"name": ".*"/, `"name": "${data.projectName}"`);
      },
    },
  ],
};
