"use client";

import { Footer } from "@/components/organisms/footer";
import { Header } from "@/components/organisms/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { AccordionHeader, AccordionTrigger } from "@radix-ui/react-accordion";
import { Feature, phases, Status } from "./road-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, CircleCheck, CircleDashed, icons } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const determineStatus = (features: Feature[]): Status => {
  if (features.every(({ status }) => status === "pending")) {
    return "pending";
  } else if (features.every(({ status }) => status === "complete")) {
    return "complete";
  }
  return "active";
};

const parseStatus = (
  status: Status,
  size: string
): { content: string; Trigger: () => JSX.Element } => {
  switch (status) {
    case "active":
      return {
        content: "In the works",
        Trigger: () => <Circle color="orange" size={size} />,
      };
    case "pending":
      return {
        content: "Not started",
        Trigger: () => <CircleDashed size={size} />,
      };
    case "complete":
      return {
        content: "Ready to use",
        Trigger: () => <CircleCheck color="green" size={size} />,
      };
  }
};
const StatusLabel = ({
  status,
  size = "1rem",
}: {
  status: Status;
  size: string;
}) => {
  const { content, Trigger } = parseStatus(status, size);
  return (
    <Tooltip>
      <TooltipTrigger>
        <Trigger />
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default function RoadmapPage() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4">
          <Accordion type="single" defaultValue={phases[0].id}>
            {phases.map(({ id, title, description, features }) => (
              <AccordionItem value={id} key={id}>
                <AccordionHeader className="p-4 flex flex-row justify-between w-full">
                  <AccordionTrigger className="w-full text-start flex flex-col">
                    <span>{title}</span>
                    <span className="text-slate-700 text-xs">
                      {description}
                    </span>
                  </AccordionTrigger>
                  <StatusLabel
                    status={determineStatus(features)}
                    size="1.5rem"
                  />
                </AccordionHeader>
                <AccordionContent className="p-4 pt-0">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map(({ title, icon, description, status }) => {
                      const Icon = icons[icon];
                      return (
                        <Card key={`${id}-${title}`}>
                          <CardHeader>
                            <CardTitle>
                              <div className="flex flex-row justify-between gap-4">
                                <div className="flex flex-row items-center gap-2">
                                  <Icon color="#000" size="1rem" />
                                  <span>{title}</span>
                                </div>
                                <StatusLabel status={status} size="1rem" />
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{description}</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
