package com.interapp.views;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.sidenav.SideNav;
import com.vaadin.flow.component.sidenav.SideNavItem;

public class MainLayout extends AppLayout {

    public MainLayout() {
        Image logo = new Image("/assets/images/logotipo%20blanco.png", "InterApp");
        logo.addClassName("logo-interapp");

        Anchor inicio = new Anchor("/index.html", logo);
        inicio.setRouterIgnore(true);

        addToNavbar(new DrawerToggle(), inicio);

        SideNav menu = new SideNav();
        menu.addItem(new SideNavItem("Mi perfil", PerfilView.class, VaadinIcon.USER.create()));
        menu.addItem(new SideNavItem("Mis productos", MisProductosView.class, VaadinIcon.PACKAGE.create()));

        Anchor volver = new Anchor("/index.html", "Volver al home");
        volver.setRouterIgnore(true);
        volver.addClassName("enlace-home");

        Button salir = new Button("Cerrar sesión", evento -> Sesion.cerrar());
        salir.addClassName("boton-salir");

        addToDrawer(menu, volver, salir);
    }
}
