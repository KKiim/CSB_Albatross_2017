package com.alba;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class Main {

    public static void main(String[] args) {
	    insertAlbatrosses(new File("d/alba.csv"));
    }

    private static void insertAlbatrosses(File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO points VALUES (?, ?, ?, ?::timestamp without time zone, ?::timestamp without time zone, ?, ?, ?, ?, ?, ?, ?,?) ON CONFLICT DO NOTHING" );
            int count = 0;


            while ((line = br.readLine()) != null){
                String[] fields = line.split(",");
                ps.setInt(1, getInteger(fields[0])); //event id
                ps.setInt(2, getInteger(fields[20])); //tag_id
                ps.setString(3, fields[21]);//individual_id
                ps.setString(4, fields[2]); //ts
                ps.setString(5, fields[27]); //ts
                ps.setDouble(6, getDouble(fields[3])); //lon
                ps.setDouble(7, getDouble(fields[4])); //lat
                ps.setDouble(8, getDouble(fields[15])); //groundspeed
                ps.setDouble(9, getDouble(fields[16])); //heading
                ps.setDouble(10, getDouble(fields[17])); //height
                ps.setDouble(11, getDouble(fields[23])); //easting
                ps.setDouble(12, getDouble(fields[24])); //northing
                ps.setString(13, fields[25]); //zone
                ps.addBatch();
                if (count == 100){
                    ps.executeUpdate();
                    count = 0;
                }
                count++;
            }
            ps.close();
            c.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    private static double getDouble(String s){
        s = s.replace("\"","");
        if (s.length()<1) s="-999999.0";
        return Double.parseDouble(s);
    }

    private static int getInteger(String s){
        s = s.replaceAll("\"","");
        if (s.length()<1) s="-999999";
        return Integer.parseInt(s);
    }

    private static Connection getConnection(){
        String url = "jdbc:postgresql://localhost/csb";
        String user = "postgres";
        String password = "postgres";
        Connection conn= null;

        try {
            conn = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
}
