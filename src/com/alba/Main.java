package com.alba;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;


public class Main {

    public static void main(String[] args) {
        //insertMontes("Capitan Montes", new File("d/weather/CapitanMontes.csv"));
        //insertEloy( "Eloy Alfaro", new File("d/weather/EloyAlfaroInternational.csv"));
        //insertPedro("Pedro Canga", new File("d/weather/PedroCanga.csv"));
        //insertSanCristobal("San Cristobal", new File("d/weather/SanCristobal.csv"));
        //insertAlbatrosses(new File("d/alba.csv"));
        //insertLanduse(new File("d/landuse.csv"));
        insertJose("Jose", new File("d/weather/Jose.csv"));
    }

    private static void insertMontes(String name,  File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO weather VALUES (?, ?::timestamp without time zone, ?, ? , ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            int total = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(total);
                total++;
                String[] fields = line.split(",");
                if (!fields[8].equals("Calm")){
                    ps.setString(1, name); //location
                    ps.setString(2, fields[0]); //timestamp
                    ps.setDouble(3, getDouble(fields[1])); //temperature
                    ps.setDouble(4, getDouble(fields[3])); //dew point
                    ps.setInt(5, getInteger(fields[4])); //humidity
                    ps.setInt(6, getInteger(fields[5])); //air pressure
                    ps.setDouble(7, getDouble(fields[6])); //visibility
                    ps.setString(8, fields[7]); //wind dir
                    ps.setDouble(9, getDouble(fields[8])); //wind speed
                    ps.setString(10, fields[9]); //situation
                    ps.addBatch();
                }
                if (count == 100){
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();

            } catch (IOException e) {
                e.printStackTrace();
            } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void insertPedro(String name,  File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO weather VALUES (?, ?::timestamp without time zone, ?, ? , ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            int total = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(total);
                total++;
                String[] fields = line.split(",");
                if (!fields[8].equals("Calm") && fields.length>9){
                    ps.setString(1, name); //location
                    ps.setString(2, fields[0]); //timestamp
                    ps.setDouble(3, getDouble(fields[1])); //temperature
                    ps.setDouble(4, getDouble(fields[3])); //dew point
                    ps.setInt(5, getInteger(fields[4])); //humidity
                    ps.setInt(6, getInteger(fields[5])); //air pressure
                    ps.setDouble(7, getDouble(fields[6])); //visibility
                    ps.setString(8, fields[7]); //wind dir
                    ps.setDouble(9, getDouble(fields[8])); //wind speed
                    ps.setString(10, fields[9]); //situation
                    ps.addBatch();
                    if (count == 100){
                        ps.executeBatch();
                        count = 0;
                    }
                }

                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    private static void insertEloy(String name,  File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO weather VALUES (?, ?::timestamp without time zone, ?, ? , ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            int total = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(total);
                total++;
                String[] fields = line.split(",");
                if (!fields[1].equals("-")) {
                    ps.setString(1, name); //location
                    ps.setString(2, fields[0]); //timestamp
                    ps.setDouble(3, getDouble(fields[1])); //temperature
                    ps.setDouble(4, getDouble(fields[2])); //dew point
                    ps.setInt(5, getInteger(fields[3])); //humidity
                    ps.setInt(6, getInteger(fields[4])); //air pressure
                    ps.setDouble(7, getDouble(fields[5])); //visibility
                    ps.setString(8, fields[6]); //wind dir
                    ps.setDouble(9, getDouble(fields[7])); //wind speed
                    ps.setString(10, fields[8]); //situation
                    ps.addBatch();
                }
                if (count == 100){
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void insertSanCristobal(String name,  File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO weather VALUES (?, ?::timestamp without time zone, ?, ? , ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            int total = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(total);
                total++;
                String[] fields = line.split(",");
                if (!fields[1].equals("-")) {
                    ps.setString(1, name); //location
                    ps.setString(2, fields[0]); //timestamp
                    ps.setDouble(3, getDouble(fields[1])); //temperature
                    ps.setDouble(4, getDouble(fields[2])); //dew point
                    ps.setInt(5, getInteger(fields[3])); //humidity
                    ps.setInt(6, getInteger(fields[4])); //air pressure
                    ps.setDouble(7, getDouble(fields[5])); //visibility
                    ps.setString(8, fields[6]); //wind dir
                    ps.setDouble(9, getDouble(fields[7])); //wind speed
                    ps.setString(10, fields[8]); //situation
                    ps.addBatch();
                }
                if (count == 100){
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void insertJose(String name,  File f){
        try {
            BufferedReader br = new BufferedReader(new FileReader(f));
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO weather VALUES (?, ?::timestamp without time zone, ?, ? , ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            int total = 1;
            while ((line = br.readLine()) != null) {
                System.out.println(total);
                total++;
                String[] fields = line.split(",");
                if (!fields[1].equals("-") && !fields[2].equals("-") && fields.length == 9 && !fields[7].equals("Calm")) {
                    ps.setString(1, name); //location
                    ps.setString(2, fields[0]); //timestamp
                    ps.setDouble(3, getDouble(fields[1])); //temperature
                    ps.setDouble(4, getDouble(fields[2])); //dew point
                    ps.setInt(5, getInteger(fields[3])); //humidity
                    ps.setInt(6, getInteger(fields[4])); //air pressure
                    ps.setDouble(7, getDouble(fields[5])); //visibility
                    ps.setString(8, fields[6]); //wind dir
                    ps.setDouble(9, getDouble(fields[7])); //wind speed
                    ps.setString(10, fields[8]); //situation
                    ps.addBatch();
                }
                if (count == 100){
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    private static void insertLanduse(File f){
        BufferedReader br = null;
        try {
            String line;
            Connection c = getConnection();
            PreparedStatement ps = c.prepareStatement("INSERT INTO landuse VALUES (?, ?, ?) ON CONFLICT DO NOTHING");
            int count = 0;
            br = new BufferedReader(new FileReader(f));

            while ((line = br.readLine()) != null) {
                String[] fields = line.split(",");
                ps.setDouble(1, getDouble(fields[0]));
                ps.setDouble(2, getDouble(fields[1]));
                ps.setString(3, fields[2]);
                ps.addBatch();
                if (count == 100){
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
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
                    ps.executeBatch();
                    count = 0;
                }
                count++;
            }
            ps.executeBatch();
            ps.close();
            c.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    private static double getDouble(String s){
        s = s.replaceAll("\"","");
        s = s.replaceAll("-", "");
        s = s.replaceAll("NA","");
        if (s.length()<1) s="-999999.0";
        return Double.parseDouble(s);
    }

    private static int getInteger(String s){
        s = s.replaceAll("\"","");
        s = s.replaceAll("-", "");
        s = s.replaceAll("NA","");
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
