import java.util.Scanner;
class hello{
    void evenorodd(int a){
        if (a % 2 == 0){
            System.out.println("Even Number");
        } else {
            System.out.println("Odd Number");
        }
    }
    
    public static void main(String args[]){
        hello obj = new hello();
        Scanner scan = new Scanner(System.in);
        int remainder = scan.nextInt();
        obj.evenorodd(remainder);;
        scan.close();
        
    }
}