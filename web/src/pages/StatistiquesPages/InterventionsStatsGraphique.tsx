import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import PageMeta from "../../components/common/PageMeta";
import { useState, useRef, useEffect } from "react";
import interventionsStatsService from "../../services/InterventionsStatsService";
import type { StatsJournalier, StatsJournalierFormData } from "../../types";
import flatpickr from "flatpickr";
import { CalenderIcon } from "../../icons";
import Radio from "../../components/form/input/Radio";

export default function InterventionsStatsGraphique() {

  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDefaultStats = async () => {
      try {
        setFormLoading(true);
        const dateDebutAdjusted = new Date(dateDebut);
        dateDebutAdjusted.setDate(dateDebutAdjusted.getDate());

        const dateFinAdjusted = new Date(dateFin);
        dateFinAdjusted.setDate(dateFinAdjusted.getDate() + 2);

        const payload: StatsJournalierFormData = {
          statut: "Créé",
          date_debut: new Date(dateDebutAdjusted),
          date_fin: new Date(dateFinAdjusted),
        } as StatsJournalierFormData;

        const res = await interventionsStatsService.getStatsInterventionsParJour(payload);

        const stats = res?.stats || [];

        const newCategories = stats.map((s) => {
          const d = new Date(s.jour);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        });

        const newData = stats.map((s) => s.montant_total);

        setCategories(newCategories.length ? newCategories : ["-"]);
        setChartSeries([
          {
            name: "Montant total",
            data: newData.length ? newData : [0],
          },
        ]);
      } catch (err) {
        console.error(err);
        setFormError("Erreur lors du chargement des statistiques.");
      } finally {
        setFormLoading(false);
      }
    };

    loadDefaultStats();
  }, []);


  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      // defaultDate: [sevenDaysAgo, today],
      defaultDate: [day1, day15],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          setDateDebut(selectedDates[0].toISOString().slice(0, 10));
          setDateFin(selectedDates[1].toISOString().slice(0, 10));
        }
      },
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  const [statut, setStatut] = useState<string>("Créé");
  // const [dateDebut, setDateDebut] = useState<string>(new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().slice(0, 10));
  // const [dateFin, setDateFin] = useState<string>(new Date().toISOString().slice(0, 10));
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const today = new Date();

  const day1 = new Date(today.getFullYear(), today.getMonth(), 1);
  const day15 = new Date(today.getFullYear(), today.getMonth(), 15);

  const [dateDebut, setDateDebut] = useState<string>(
    day1.toISOString().slice(0, 10)
  );

  const [dateFin, setDateFin] = useState<string>(
    day15.toISOString().slice(0, 10)
  );


  const defaultCategories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [categories, setCategories] = useState<string[]>();
  const [chartSeries, setChartSeries] = useState<any[]>([
    // {
    //   name: "Sales",
    //   data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    // },
  ]);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} Ar`,
      },
    },
  };

  const handleStatsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const dateDebutAdjusted = new Date(dateDebut);
      dateDebutAdjusted.setDate(dateDebutAdjusted.getDate());

      const dateFinAdjusted = new Date(dateFin);
      dateFinAdjusted.setDate(dateFinAdjusted.getDate() + 2);

      const payload: StatsJournalierFormData = {
        statut: statut,
        date_debut: dateDebutAdjusted,
        date_fin: dateFinAdjusted,
      } as StatsJournalierFormData;

      const res: StatsJournalier = await interventionsStatsService.getStatsInterventionsParJour(payload);
      const stats = res?.stats || [];
      const newCategories = stats.map((s) => {
        const d = new Date(s.jour);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      });
      const newData = stats.map((s) => s.montant_total);

      setCategories(newCategories.length ? newCategories : ["-"]);
      setChartSeries([{ name: "Montant total", data: newData.length ? newData : [0] }]);
    } catch (err) {
      console.error("Erreur lors du chargement des stats journalier:", err);
      // console.log(err.response?.data);
      setFormError("Erreur lors du chargement des statistiques.");
    } finally {
      setFormLoading(false);
    }
  };
  return (
    <div>
      <PageMeta
        title="React.js Chart Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Chart Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Interventions" />
      <div className="col-span-12 space-y-6 xl:col-span-12">

        <div className="space-y-6">
          <ComponentCard title="Interventions"
            headerRight={
              <form
                onSubmit={handleStatsSubmit}
                className="flex items-center justify-center gap-4 flex-wrap"
              >
                <div className="flex gap-4">
                  <Radio
                    id="radio-cree"
                    name="statut"
                    value="Créé"
                    checked={statut === "Créé"}
                    onChange={setStatut}
                    label="Créé"
                  />
                  <Radio
                    id="radio-paye"
                    name="statut"
                    value="Payé"
                    checked={statut === "Payé"}
                    onChange={setStatut}
                    label="Payé"
                  />
                  <Radio
                    id="radio-encours"
                    name="statut"
                    value="En cours"
                    checked={statut === "En cours"}
                    onChange={setStatut}
                    label="En cours"
                  />
                  <Radio
                    id="radio-termine"
                    name="statut"
                    value="Terminé"
                    checked={statut === "Terminé"}
                    onChange={setStatut}
                    label="Terminé"
                  />
                </div>

                <div className="flex items-end gap-4">
                  <div className="relative inline-flex items-center">
                    <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:translate-x-0 size-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />

                    <input
                      ref={datePickerRef}
                      className="h-10 w-10 lg:w-40 lg:h-auto lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
                      placeholder="Select date range"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    // className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-brand-500 disabled:bg-brand-400 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    {formLoading ? (<><div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />Chargement...</>) : "Afficher"}
                  </button>
                </div>

                {formError && (
                  <div className="text-red-600 text-sm">
                    {formError}
                  </div>
                )}
              </form>

            }
          >
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <div id="chartOne" className="min-w-[1000px]">
                <Chart options={options} series={chartSeries} type="bar" height={180} />
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
