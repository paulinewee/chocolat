import { BoxBuilderProvider } from "@/context/BoxBuilderContext";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BoxBuilderProvider>{children}</BoxBuilderProvider>;
}
