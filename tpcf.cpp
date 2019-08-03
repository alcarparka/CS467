//Two point correlation function (no parallelization)
// Justin Clarke

#include <omp.h>
#include <stdio.h>
#include <iostream>
#include <fstream> 
#include <math.h>
#include <random>
using std::ifstream;
using std::ofstream;
using std::cin;
using std::cout;
using std::endl;
using std::uniform_real_distribution;
using std::default_random_engine;


// distance function
double dist(double * p1, double * p2) {
	return sqrt((p1[0] - p2[0])*(p1[0] - p2[0]) + (p1[1] - p2[1])*(p1[1] - p2[1]) + (p1[2] - p2[2])*(p1[2] - p2[2]));
} 



// main tpcf calculator function
int main(void) {

	// arguments will be read from file or provided by UI
	double maxSpaceX = 100;
	double minSpaceX = 0;
	double maxSpaceY = 100;
	double minSpaceY = 0;
	double maxSpaceZ = 100;
	double minSpaceZ = 0;
	double multiplier = 1;
	double maxLength = 100.0;
	int numBins = 10;
	// counters
	int i = 0;
	int j = 0;
	int k = 0;

	// seed for random coordinate generator
	unsigned long seed_val = 100;

	double binWidth = log10(maxLength)/numBins;
	double bin_ranges[numBins + 1];
	
	for (i = 0; i < numBins + 1; i++) {
		bin_ranges[i] = 0.0;
	}

	for (i = 1; i < numBins + 1; i++) {
		bin_ranges[i] = i*binWidth;
	}

	printf("Exponential Bin Ranges:\n");
	for (i = 0; i < numBins + 1; i++) {
		printf("%2.11lf\n", bin_ranges[i]);
	}

	// convert exponential bin limits to real values
	for (i = 0; i < numBins + 1; i++) {
		bin_ranges[i] = pow(10, bin_ranges[i]);
	}
	bin_ranges[0] = 0;

	printf("Real Bin Ranges:\n");
	for (i = 0; i < numBins + 1; i++) {
		printf("%2.11lf\n", bin_ranges[i]);
	}

	// create array to hold up to 10000 3D coordinates
	double coords[10000][3];
   	//read data from file
   	ifstream inputFile;
   	inputFile.open("test_coords.txt");
   	if (!inputFile) {
        cout << "File failed to open" << endl;
        return 1;
    }
    //continue reading until EOF
    double number;
    i = 0;
    j = 0;
    while (inputFile >> number && i < 10000) {
    	if (j > 2) {
    		j = 0;
    		i += 1;
    	}
        coords[i][j] = number;
        j += 1;
    }
    inputFile.close();

    // number of coordinates
    int numCoords = i + 1;
    int numRandomCoords = multiplier*numCoords;
    printf("numCoords: %d\n", numCoords);
    printf("numRandomCoords: %d\n\n", numRandomCoords);

    // print first 10 coordinates for verification
    for (i = 0; i < 9; i++) {
    	for (j = 0; j < 3; j++) {
    		printf("%2.11lf ", coords[i][j]);
    	}
    	printf("\n");
    }
    printf("\n\n");

    printf("Last coords: %2.11lf, %2.11lf, %2.11lf\n", coords[numCoords - 1][0], coords[numCoords - 1][1], coords[numCoords - 1][2]);

    // generate random coordinates
    double random_coords [numRandomCoords][3];

	uniform_real_distribution<double> unif_x(minSpaceX, maxSpaceX);
	uniform_real_distribution<double> unif_y(minSpaceY, maxSpaceY);
	uniform_real_distribution<double> unif_z(minSpaceZ, maxSpaceZ);
	default_random_engine re;
	re.seed(seed_val);
	i = 0;
	j = 0;
	while (i < numRandomCoords) {
		random_coords[i][0] = unif_x(re);
		random_coords[i][1] = unif_y(re);
		random_coords[i][2] = unif_z(re);
		i += 1;
	}

	// print first 10 coordinates for verification
    for (i = 0; i < 9; i++) {
    	for (j = 0; j < 3; j++) {
    		printf("%2.11lf ", random_coords[i][j]);
    	}
    	printf("\n");
    }
    printf("\n\n");


    double d = 0.0;
    k = 0;
    // find DD distances
    double DD_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
    	DD_bin_counts[i] = 0;
    }
    printf("Finding DD distances\n");
    for (i = 0; i < numCoords; i++) {
    	for (j = 0; j < numCoords; j++) {
			d = dist(coords[i], coords[j]);
			k = 0;
			while (k < 10) {
				if (d > bin_ranges[k] && d < bin_ranges[k + 1]) {
					DD_bin_counts[k] += 1;
					k = 12;
				}
				k += 1;
			}
		}
    }

    // find DR distances
    double DR_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
    	DR_bin_counts[i] = 0;
    }
    printf("Finding DR distances\n");
    for (i = 0; i < numCoords; i++) {
    	for (j = 0; j < numRandomCoords; j++) {
			d = dist(coords[i], random_coords[j]);
			k = 0;
			while (k < 10) {
				if (d > bin_ranges[k] && d < bin_ranges[k + 1]) {
					DR_bin_counts[k] += 1;
					k = 12;
				}
				k += 1;
			}
		}
    }

    // find RR distances
    double RR_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
    	RR_bin_counts[i] = 0;
    }
    printf("Finding RR distances\n");
    for (i = 0; i < numRandomCoords; i++) {
    	for (j = 0; j < numRandomCoords; j++) {
			d = dist(random_coords[i], random_coords[j]);
			k = 0;
			while (k < 10) {
				if (d > bin_ranges[k] && d < bin_ranges[k + 1]) {
					RR_bin_counts[k] += 1;
					k = 12;
				}
				k += 1;
			}
		}
    }

    printf("Calculating tpcf values\n");
    // calculate tpcf values
    double tpcf_vals[numBins];
    for (i = 0; i < numBins; i++) {
    	tpcf_vals[i] = 0;
    }
    double nr = numRandomCoords;
    double nd = numCoords;
    for (i = 0; i < numBins; i++) {
    	double DD = DD_bin_counts[i];
    	double DR = DR_bin_counts[i];
    	double RR = RR_bin_counts[i];
    	if (RR == 0) {
    		tpcf_vals[i] = 0;
    	}
    	else {
    		tpcf_vals[i] = (1/RR)*((DD * pow((nr/nd), 2)) - ((2*DR)*(nr/nd)) + RR);
    	}
    }

    // write bin limits and calculated values to file
    ofstream binOutputFile;
    binOutputFile.open("bin_limits.txt");
    for (i = 0; i < numBins + 1; i++) {
        binOutputFile << bin_ranges[i] << ' ';
    }
    binOutputFile.close();

    ofstream tpcfOutputFile;
    tpcfOutputFile.open("tpcf_vals.txt");
    for (i = 0; i < numBins; i++) {
    	tpcfOutputFile << tpcf_vals[i] << ' ';
    }

    return 0;
}










