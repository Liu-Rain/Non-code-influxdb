import { useReactFlow } from "@xyflow/react";

import { Cylinder } from "lucide-react";

import { ComboboxNode } from "@/features/flow/components/flow-nodes/combobox-node";
import { NodeProps } from "@/features/flow/components/flow-nodes/types";
import { NODE_TITLES } from "@/features/flow/components/sidebar/constants";
import { useBuckets } from "@/features/flow/hooks/use-buckets";

export const BucketNode = ({ id }: NodeProps) => {
  const { data } = useBuckets();

  const { updateNodeData } = useReactFlow();

  const handleSelectBucket = (bucket: string | undefined) =>
    updateNodeData(id, { value: bucket, result: { bucket } });

  return (
    <ComboboxNode
      id={id}
      title={NODE_TITLES.BUCKET}
      icon={Cylinder}
      selections={data?.buckets}
      underHandle
      underHandleId="BUCKET"
      onSelectNodeOption={handleSelectBucket}
      isPreviousNodeValueChanged={false}
    />
  );
};
