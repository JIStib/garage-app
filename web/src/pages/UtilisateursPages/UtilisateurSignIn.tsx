import PageMeta from "../../components/common/PageMeta";
import UtilisateutAuthLayout from "./UtilisateurAuthPageLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { EyeIcon, EyeCloseIcon } from "../../icons";
import utilisateurLoginService from "../../services/UtilisisateurLoginService";
import { Utilisateur } from "../../types";
import { useAuth } from "../../hooks/useAuth";

export default function UtilisateurSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifiant, setIdentifiant] = useState("Gg");
  const [mdp, setMdp] = useState("gg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userData: Utilisateur = {
        identifiant: identifiant,
        mdp: mdp,
      } as Utilisateur;
      const user = await utilisateurLoginService.login(userData);
      if (user !== null) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate("/accueil");
      } else {
        setError("Identifiant ou mot-de-passe incorrect");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError("Erreur lors de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <UtilisateutAuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto">
          </div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Connexion
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Entrez votre identifiant et votre mot-de-passe pour vous connecter.
                </p>
              </div>
              {error && (
                <div className="mb-5 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Identifiant{" "}
                      </Label>
                      <Input 
                        placeholder="gg"
                        value={identifiant}
                        onChange={(e) => setIdentifiant(e.target.value)}
                        // required
                      />
                    </div>
                    <div>
                      <Label>
                        Mot-de-passe{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Entrer votre mot-de-passe"
                          value={mdp}
                          onChange={(e) => setMdp(e.target.value)}
                          // required
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        disabled={loading}
                      >
                        {loading ? (<><div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />Connexion en cours...</>) : "Se connecter"}
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    Vous êtes nouveau ? {""}
                    <Link
                      to="/connexion"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UtilisateutAuthLayout>
    </>
  );
}
