import { MostCommonStreet } from '@/modules/addresses/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { MapPin } from 'lucide-react';

interface MostCommonStreetsProps {
  streets: MostCommonStreet[];
  isLoading?: boolean;
}

export const MostCommonStreets = ({ streets, isLoading }: MostCommonStreetsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Самые встречающиеся улицы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!streets || streets.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Самые встречающиеся улицы
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {streets.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border"
            >
              <span className="font-medium text-sm">{item.street}</span>
              <span className="text-xs text-muted-foreground">({item.count})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

