/**
 * Layout de l'administration
 * -----------------------------------------
 * Structure principale de l'espace admin :
 * sidebar à gauche + contenu à droite.
 */

import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-background">
    <AdminSidebar />
    <main className="flex-1 p-8 overflow-auto">{children}</main>
  </div>
);

export default AdminLayout;
