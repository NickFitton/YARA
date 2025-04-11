import { LucideProps } from "lucide-react";
import {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";

export interface TabCardProps extends PropsWithChildren<object> {
  title: string;
  subtitle: string;
  tabValue: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export function TabCard({
  title,
  subtitle,
  Icon,
  children,
  tabValue,
}: TabCardProps) {
  return (
    <TabsContent value={tabValue} className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2 items-center">
              <Icon className="h-6 w-6 text-orange-500" />
              <h1 className="text-2xl">{title}</h1>
            </div>
            <span className="text-sm font-thin text-gray-500">{subtitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </TabsContent>
  );
}
