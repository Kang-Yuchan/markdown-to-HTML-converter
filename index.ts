import { promises as fs } from "fs";
import * as readline from "readline";
import { marked } from "marked";
import { dirname } from "path";

class MarkdownToHTML {
  async markdownToHTML(inputPath: string, outputPath: string) {
    const outputPathDir = dirname(outputPath);
    try {
      await fs.mkdir(outputPathDir, { recursive: true });
      const markdown = await fs.readFile(inputPath, "utf8");
      const html = await marked.parse(markdown);

      await fs.writeFile(outputPath, html);
    } catch (error) {
      console.error("マークダウンをHTMLに変換中にエラーが発生しました:", error);
    }
  }

  executeCommand(command: string, args: string[]) {
    if (command === "markdown") {
      this.markdownToHTML(args[0], args[1]);
    } else {
      new Error("Unknown command.");
    }
  }
}
class CommandLineApp {
  private markdownToHTML = new MarkdownToHTML();

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("", (input) => {
      const [command, ...args] = input.split(" ");

      if (args.length !== 2) {
        console.error("Error: Invalid prompt");
        rl.close();
        return;
      }

      this.markdownToHTML.executeCommand(command, args);
      rl.close();
    });
  }
}

const app = new CommandLineApp();
app.start();
