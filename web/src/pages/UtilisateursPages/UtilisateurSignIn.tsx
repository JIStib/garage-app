import PageMeta from "../../components/common/PageMeta";
import UtilisateutAuthLayout from "./UtilisateurAuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function UtilisateurSignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <UtilisateutAuthLayout>
        <SignInForm />
      </UtilisateutAuthLayout>
    </>
  );
}
