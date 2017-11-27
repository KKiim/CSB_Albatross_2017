package com.alba;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Main {

    public static void main(String[] args) {
	    insertAlbatrosses(new File("d/alba.csv"));
    }

    private static void insertAlbatrosses(File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            while ((line = br.readLine()) != null){
                String[] fields = line.split(",");

            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private Connection getConnection(){
        String url = "jdbc:postgresql://localhost/testdb";
        String user = "user12";
        String password = "34klq*";
        Connection conn= null;

        try {
            conn = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
}
