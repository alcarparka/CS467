if __name__ == '__main__':

    import os.path
    import time


    # checking inputFile.txt file

    if os.path.exists('uploads/inputFile.txt')==True and os.path.exists('uploads/inputFile.csv')==True:
        #print("inputFile.txt exists")

        #if inputFile.txt exists and inputFile.csv exists and inputFile.csv is newer file 

        if time.ctime(os.path.getmtime('uploads/inputFile.txt')) < time.ctime(os.path.getmtime('uploads/inputFile.csv')):
            with open("uploads/inputFile.csv", "r") as f:

                #print( time.ctime(os.path.getmtime('uploads/inputFile.txt')))
                #print( time.ctime(os.path.getmtime('uploads/inputFile.csv')))
                #print("inputFile.csv is the newer file.\n")

                n=0
                for l in f:
                    n+=1
                    #print("Line Number: ", n)

                    line=l.strip()

                    line_size = [x for x in line.split(',')]
                    count=(len(line_size))

                    # useful prints 
                    #print(line_size)
                    #print(count)

                    # if line size is greater than 3
                    if count>3 or count<3:
                        print("Invalid File, line is more or less than 3 coordinates\n")
                        quit()
                    # if non int/float data
                    for i in line_size:
                        numPeriods=0
                        for j in range(len(i)):
                            #print(i[j])
                            if i[j]!='1' and i[j]!='2' and i[j]!='3' and i[j]!='4' and i[j]!='5' and i[j]!='6' and i[j]!='7' and i[j]!='8' and i[j]!='9' and i[j]!='0' and i[j]!='.':
                                print("Invalid File, contains non-numeric character input\n")
                                quit()
                            if i[j]=='.':
                                numPeriods+=1
                            if numPeriods>1:
                                print("Invalid File, number sequence provided is not a float\n")
                                quit()
                    # should be writting into a .txt file from here 
                    #line= line.replace(",", " ")
                    #newFile.write(line + '\n')
                        #print('\n')
                        #print("num Periods: ", numPeriods)
            print("Valid .csv data file provided\n")

            with open("uploads/inputFile.csv", "r") as f, open("uploads/inputFile.txt", "w") as newFile:
                for l in f:
                    # should be writting into a .txt file from here
                    line=l.strip()
                    line= line.replace(",", " ")
                    newFile.write(line + '\n')
            #print(".csv data converted to .txt file\n")
            quit()


        # if only inputFile.txt exists or inputFile.txt is newer file 

        else:     
            with open("uploads/inputFile.txt", "r") as f:
                n=0
                for l in f:
                    n+=1
                    #print("Line Number: ", n)
                    line=l.strip()

                    line_size = [x for x in line.split()]
                    count=(len(line_size))

                    #useful prints
                    #print(line_size)
                    #print(count)

                    # if line size is greater than 3
                    if count>3 or count<3:
                        print("Invalid File, line is more or less than 3 coordinates\n")
                        quit()

                    # if non int data
                    for i in line_size:
                        numPeriods=0
                        for j in range(len(i)):
                            #print(i[j])
                            if i[j]!='1' and i[j]!='2' and i[j]!='3' and i[j]!='4' and i[j]!='5' and i[j]!='6' and i[j]!='7' and i[j]!='8' and i[j]!='9' and i[j]!='0' and i[j]!='.':
                                print("Invalid File, contains non-numeric character input\n")
                                quit()
                            if i[j]=='.':
                                numPeriods+=1
                            if numPeriods>1:
                                print("Invalid File, number sequence provided is not a float\n")
                                quit()
                        #print('\n')
                        #print("num Periods: ", numPeriods)
            print("Valid .txt data file provided\n")
            quit()


    if os.path.exists('uploads/inputFile.txt')==True:
        print("inputFile.txt exists")        

        with open("uploads/inputFile.txt", "r") as f:
            n=0
            for l in f:
                n+=1
                #print("Line Number: ", n)
                line=l.strip()

                line_size = [x for x in line.split()]
                count=(len(line_size))

                #useful prints
                #print(line_size)
                #print(count)

                # if line size is greater than 3
                if count>3 or count<3:
                    print("Invalid File, line is more or less than 3 coordinates\n")
                    quit()

                    # if non int data
                for i in line_size:
                    numPeriods=0
                    for j in range(len(i)):
                        #print(i[j])
                        if i[j]!='1' and i[j]!='2' and i[j]!='3' and i[j]!='4' and i[j]!='5' and i[j]!='6' and i[j]!='7' and i[j]!='8' and i[j]!='9' and i[j]!='0' and i[j]!='.':
                            print("Invalid File, contains non-numeric character input\n")
                            quit()
                        if i[j]=='.':
                            numPeriods+=1
                        if numPeriods>1:
                            print("Invalid File, number sequence provided is not a float\n")
                            quit()
                        #print('\n')
                        #print("num Periods: ", numPeriods)
            print("Valid .txt data file provided\n")
            quit()


    #checking inputFile.csv

    if os.path.exists('uploads/inputFile.csv')==True:
        print("inputFile.csv exists")

        with open("uploads/inputFile.csv", "r") as f:
            n=0
            for l in f:
                n+=1
                #print("Line Number: ", n)

                line=l.strip()

                line_size = [x for x in line.split(',')]
                count=(len(line_size))

                # useful prints 
                #print(line_size)
                #print(count)

                # if line size is greater than 3
                if count>3 or count<3:
                    print("Invalid File, line is more or less than 3 coordinates\n")
                    quit()
                # if non int/float data
                for i in line_size:
                    numPeriods=0
                    for j in range(len(i)):
                        #print(i[j])
                        if i[j]!='1' and i[j]!='2' and i[j]!='3' and i[j]!='4' and i[j]!='5' and i[j]!='6' and i[j]!='7' and i[j]!='8' and i[j]!='9' and i[j]!='0' and i[j]!='.':
                            print("Invalid File, contains non-numeric character input\n")
                            quit()
                        if i[j]=='.':
                            numPeriods+=1
                        if numPeriods>1:
                            print("Invalid File, number sequence provided is not a float\n")
                            quit()
                # should be writting into a .txt file from here 
                #line= line.replace(",", " ")
                #newFile.write(line + '\n')
                    #print('\n')
                    #print("num Periods: ", numPeriods)
        print("Valid .csv data file provided\n")

        with open("uploads/inputFile.csv", "r") as f, open("uploads/inputFile.txt", "w") as newFile:
            for l in f:
                # should be writting into a .txt file from here
                line=l.strip()
                line= line.replace(",", " ")
                newFile.write(line + '\n')
        #print(".csv data converted to .txt file\n")
