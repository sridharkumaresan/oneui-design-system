import type { SearchIntent } from "./SearchIntent";
import type { SearchRequestDescriptor } from "./SearchRequestDescriptor";

export interface IRequestDescriptorBuilder {
  build(intent: SearchIntent): SearchRequestDescriptor;
}

