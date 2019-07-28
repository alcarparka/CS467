if __name__ == '__main__':

    with open("test_coords.txt", "r") as f:
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
                    print("Error, line is more than 3 coordinates\n")
                    quit()

            # if non int data
            for i in line_size:
                numPeriods=0
                for j in range(len(i)):
                    #print(i[j])
                    if i[j]!='1' and i[j]!='2' and i[j]!='3' and i[j]!='4' and i[j]!='5' and i[j]!='6' and i[j]!='7' and i[j]!='8' and i[j]!='9' and i[j]!='0' and i[j]!='.':
                        print("invalid character input")
                        quit()
                    if i[j]=='.':
                        numPeriods+=1
                    if numPeriods>1:
                        print("number sequence provided is not a float")
                        quit()
                #print('\n')
                #print("num Periods: ", numPeriods)
        print("valid input file data provided")
