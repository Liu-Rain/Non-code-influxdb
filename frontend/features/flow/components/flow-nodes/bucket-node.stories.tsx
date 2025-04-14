import type { Meta, StoryObj } from "@storybook/react";

import { BucketNode } from "@/features/flow/components/flow-nodes/bucket-node";

const meta: Meta<typeof BucketNode> = {
  title: "Editor/ComboboxNode",
  component: BucketNode,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof BucketNode>;

export const BucketNodeStory: Story = {};
