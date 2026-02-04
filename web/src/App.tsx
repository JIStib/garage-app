import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import TypeReparationList from "./pages/TypesReparationPages/TypeReparationList";
import ReparationList from "./pages/ReparationsPages/ReparationList";
import ReparationDetails from "./pages/ReparationsPages/ReparationDetails";
import UtilisateurSignIn from "./pages/UtilisateursPages/UtilisateurSignIn";
import UtilisateurSignUp from "./pages/UtilisateursPages/UtilisateurSignUp";
import Accueil from "./pages/Accueil/Accueil";
import InterventionsStats from "./pages/StatistiquesPages/InterventionsStatsMontants";
import ClientsStats from "./pages/StatistiquesPages/ClientsStats";
import InterventionsStatsMontants from "./pages/StatistiquesPages/InterventionsStatsMontants";
import InterventionsStatsGraphique from "./pages/StatistiquesPages/InterventionsStatsGraphique";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/accueil" element={<Accueil />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Types reparation */}
            <Route path="/types-reparation" element={<TypeReparationList />} />

            {/* reparations */}
            <Route path="/reparations" element={<ReparationList />} />

            {/* reparations details */}
            <Route path="/reparations/:id" element={<ReparationDetails />} />

            {/* Statistiques */}
            {/* <Route path="/interventions-stats" element={<InterventionsStats />} />
            <Route path="/clients-stats" element={<ClientsStats />} /> */}

            {/* Statistiques */}
            <Route path="/interventions-montants" element={<InterventionsStatsMontants />} />
            <Route path="/interventions-graphique" element={<InterventionsStatsGraphique />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* utilisateur */}
          <Route path="/" element={<UtilisateurSignIn />} />
          <Route path="/connexion" element={<UtilisateurSignIn />} />
          <Route path="/inscription" element={<UtilisateurSignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
