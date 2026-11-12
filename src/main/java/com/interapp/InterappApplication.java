package com.interapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.theme.aura.Aura;

@SpringBootApplication
@StyleSheet(Aura.STYLESHEET)
@StyleSheet("context://css/vaadin.css")
public class InterappApplication implements AppShellConfigurator {

	public static void main(String[] args) {
		SpringApplication.run(InterappApplication.class, args);
	}

}
