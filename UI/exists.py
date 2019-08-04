if __name__ == '__main__':

    import os.path 
    import time
    
    time.sleep(10) 

    csv= os.path.exists('uploads/inputFile.csv')

    txt= os.path.exists('uploads/inputFile.txt')
    
    print(csv)
    print(txt)

    #print("in exists executable")

    if os.path.exists('uploads/inputFile.csv')==True:
        f=open("inputResult.txt", "w+")
        f.write("Input File Exists");
        f.close()
        print("inputFile.csv exists")
    

    if os.path.exists('uploads/inputFile.txt')==True:
        print("inputFile.txt exists")
        f=open("inputResult.txt", "w+")
        f.write("Input File Exists")
        f.close()
