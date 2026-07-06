import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { groupRentsByOwner } from "@/utils/rentHelpers";
import RentGroupCard from "@/components/Rent/RentGroupCard";

const UnitRenters = ({ appartmentId, apiUrl }) => {
  const { t } = useTranslation();

  const { data, loading, refetch } = useGet({
    url: `${apiUrl}/rents`,
  });

  if (loading) {
    return <FullPageLoader />;
  }

  const allRenters = data?.rents || [];

  const renters = allRenters.filter(
    (renter) => String(renter.appartment_id) === String(appartmentId)
  );

  const rentGroupsArray = groupRentsByOwner(renters);

  if (rentGroupsArray.length === 0) {
    return (
      <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
          <Users className="h-12 w-12 text-slate-300 !mb-3" />
          <h3 className="text-lg font-bold text-slate-700">{t("No Renters Found")}</h3>
          <p className="text-sm font-medium text-slate-400 !mt-1">
            {t("Norentersfoundforthisunit")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {rentGroupsArray.map((group) => (
        <RentGroupCard
          key={group.key}
          group={group}
          apiUrl={apiUrl}
          refetch={refetch}
          showUnit={false}
        />
      ))}
    </div>
  );
};

export default UnitRenters;
