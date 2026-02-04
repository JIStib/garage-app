import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect } from "react";
import Badge from "../../components/ui/badge/Badge";
import { BoxIconLine, GroupIcon } from "../../icons";
import interventionsStatsService from "../../services/InterventionsStatsService";
import { StatsMontantTotal } from "../../types";

export default function Accueil() {
  const [montantCreees, setMontantCreees] = useState<StatsMontantTotal | null>(null);
  const [montantPayees, setMontantPayees] = useState<StatsMontantTotal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [creees, payees] = await Promise.all([
          interventionsStatsService.getMontantTotalInterventionsCreees(),
          interventionsStatsService.getMontantTotalInterventionsPayees(),
        ]);
        setMontantCreees(creees);
        setMontantPayees(payees);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <>
      {/* <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <PageMeta
        title="Garage app"
        description="GG!"
      />
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {/* <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" /> */}
              <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {/* Nb total de Clients : <b>{montantCreees?.count || 0}</b> */}
                  Nb total de Clients :
                </span>
                {loading ? (
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/20 border-t-brand-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Chargement...</span>
                  </div>
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {montantCreees?.count || 0}
                  </h4>
                )}
              </div>
              <Badge color="success">
                {montantCreees?.count || 0}
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}

          {/* <!-- Metric Item Start --> */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Nb interventions payées : <b>{montantPayees?.count || 0}</b>
                </span>
                {loading ? (
                  <div className="mt-5 flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/20 border-t-brand-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Chargement...</span>
                  </div>
                ) : (
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                    {montantPayees?.total || 0} Ar
                  </h4>
                )}
              </div>

              <Badge color="success">
                {montantPayees?.count || 0}
              </Badge>
            </div>
          </div>
          {/* <!-- Metric Item End --> */}
        </div>
      </div>
    </>
  );
}
