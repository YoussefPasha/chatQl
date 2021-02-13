import React from "react";

import { ApolloProvider as Provider } from "@apollo/client";
import { client } from "./Client";

export default function ApolloProvider(props: any) {
  return <Provider client={client} {...props} />;
}
