//Two point correlation function calculator program
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
using std::random_device;


// set the number of threads:
#ifndef NUMT
#define NUMT    16
#endif

// distance function
// applies periodic boundary conditions along each axis


double dist(double * p1, double * p2, double xLength, double yLength, double zLength) {
    double dx = p1[0] - p2[0];
    double dy = p1[1] - p2[1];
    double dz = p1[2] - p2[2];
    
    if (abs(dx) > xLength/2) {
        dx = xLength - abs(dx);
    }
    if (abs(dy) > yLength/2) {
        dy = yLength - abs(dy);
    }
    if (abs(dz) > zLength/2) {
        dz = zLength - abs(dz);
    }

	return sqrt((dx*dx) + (dy*dy) + (dz*dz));
} 


// main tpcf calculator function
int main(void) {

  // verify openmp support

    #ifndef _OPENMP
        fprintf( stderr, "No OpenMP support!\n" );
        return 1;
    #endif

    double time0 = omp_get_wtime( );

    // set the number of threads to use
    omp_set_num_threads(NUMT);

// arguments will be read from file or provided by UI

	double maxSpaceX = 100;
	double minSpaceX = 0;
	double maxSpaceY = 100;
	double minSpaceY = 0;
	double maxSpaceZ = 100;
	double minSpaceZ = 0;
	double maxLength = 100.0;
    	double xLength = maxSpaceX - minSpaceX;
    	double yLength = maxSpaceY - minSpaceY;
    	double zLength = maxSpaceZ - minSpaceZ;
	int numBins = 10;

// counters

	int i = 0;
	int j = 0;
	int k = 0;

	double binWidth = log10(maxLength)/numBins;
	double bin_ranges[numBins + 1];

    bin_ranges[0] = 0;

	for (i = 1; i < numBins + 1; i++) {
		bin_ranges[i] = i*binWidth;
	}

// convert exponential bin limits to real values

	for (i = 0; i < numBins + 1; i++) {
		bin_ranges[i] = pow(10, bin_ranges[i]);
	}
	bin_ranges[0] = 0;

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
    int numRandomCoords = numCoords;

// generate random coordinates

double random_coords [numRandomCoords][3];
    random_device rd;
    default_random_engine re(rd());
	uniform_real_distribution<double> unif_x(minSpaceX, maxSpaceX);
	uniform_real_distribution<double> unif_y(minSpaceY, maxSpaceY);
	uniform_real_distribution<double> unif_z(minSpaceZ, maxSpaceZ);

//re.seed(seed_val);

	i = 0;
	while (i < numRandomCoords) {
		random_coords[i][0] = unif_x(re);
		random_coords[i][1] = unif_y(re);
		random_coords[i][2] = unif_z(re);
		i += 1;
	}

// find DD distances

    double DD_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
        DD_bin_counts[i] = 0;
    }

    double DD_bin_counts_private[NUMT * numBins];
    for (int x = 0; x < NUMT * numBins; x++) {
        DD_bin_counts_private[x] = 0;
    }
        
    #pragma omp parallel for collapse(2) default(none) shared(xLength, yLength, zLength, numCoords, numBins, coords, bin_ranges, DD_bin_counts_private)
    for (int x = 0; x < numCoords; x++) {
        for (int y = 0; y < numCoords; y++) {
			double distance = dist(coords[x], coords[y], xLength, yLength, zLength);
			int z = 0;
            while (z < numBins) {
				if (distance > bin_ranges[z] && distance < bin_ranges[z + 1]) {
					DD_bin_counts_private[omp_get_thread_num( ) * numBins + z] += 1;
					z = numBins + 1;
				}
				z += 1;
			}
		}
    }

    for (int n = 0; n < numBins; n++) {
        for (int m = 0; m < NUMT; m++) {
            DD_bin_counts[n] += DD_bin_counts_private[m * numBins + n];
        }
    }

// find DR distances

double DR_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
        DR_bin_counts[i] = 0;
    }

    double DR_bin_counts_private[NUMT * numBins];
    for (int x = 0; x < NUMT * numBins; x++) {
        DR_bin_counts_private[x] = 0;
    }

    #pragma omp parallel for collapse(2) default(none) shared(xLength, yLength, zLength, numCoords, numRandomCoords, numBins, coords, random_coords, bin_ranges, DR_bin_counts_private)
    for (int x = 0; x < numCoords; x++) {
        for (int y = 0; y < numRandomCoords; y++) {
            double distance = dist(coords[x], random_coords[y], xLength, yLength, zLength);
            int z = 0;
            while (z < numBins) {
                if (distance > bin_ranges[z] && distance < bin_ranges[z + 1]) {
                    DR_bin_counts_private[omp_get_thread_num( ) * numBins + z] += 1;
                    z = numBins + 1;
                }
                z += 1;
            }
        }
    }

    for (int n = 0; n < numBins; n++) {
        for (int m = 0; m < NUMT; m++) {
            DR_bin_counts[n] += DR_bin_counts_private[m * numBins + n];
        }
    }

// find RR distances

double RR_bin_counts[numBins];
    for (i = 0; i < numBins; i++) {
        RR_bin_counts[i] = 0;
    }

    double RR_bin_counts_private[NUMT * numBins];
    for (int x = 0; x < NUMT * numBins; x++) {
        RR_bin_counts_private[x] = 0;
    }

    #pragma omp parallel for collapse(2) default(none) shared(xLength, yLength, zLength, numRandomCoords, numBins, random_coords, bin_ranges, RR_bin_counts_private)
    for (int x = 0; x < numRandomCoords; x++) {
        for (int y = 0; y < numRandomCoords; y++) {
            double distance = dist(random_coords[x], random_coords[y], xLength, yLength, zLength);
            int z = 0;
            while (z < numBins) {
                if (distance > bin_ranges[z] && distance < bin_ranges[z + 1]) {
                    RR_bin_counts_private[omp_get_thread_num( ) * numBins + z] += 1;
                    z = numBins + 1;
                }
                z += 1;
            }
        }
    }

    for (int n = 0; n < numBins; n++) {
        for (int m = 0; m < NUMT; m++) {
            RR_bin_counts[n] += RR_bin_counts_private[m * numBins + n];
        }
    }

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

    double time1 = omp_get_wtime( );

    double totalTime = time1 - time0;
    printf("Calculation time: %3.2lf seconds\n", totalTime);

    return 0;
}

