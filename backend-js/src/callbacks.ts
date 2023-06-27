import { BaseCallbackHandler } from "langchain/callbacks";
import { Serialized } from "langchain/load/serializable";
import { AgentAction, AgentFinish, ChainValues } from "langchain/schema";

export class MyCallbackHandler extends BaseCallbackHandler {
  name = "MyCallbackHandler";

  handleLLMNewToken(token: string) {
    console.log("token", { token });
  }

  handleLLMStart(llm: Serialized, _prompts: string[]) {
    console.log("handleLLMStart", { llm });
  }

  handleChainStart(chain: Serialized) {
    console.log("handleChainStart", { chain });
  }

  handleAgentAction(action: AgentAction) {
    console.log("handleAgentAction", action);
  }

  handleToolStart(tool: Serialized) {
    console.log("handleToolStart", { tool });
  }
}
