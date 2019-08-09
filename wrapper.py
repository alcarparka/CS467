## python wrapper program that calls a c++ program

import subprocess
import matplotlib.pyplot as plt
from math import log

c = subprocess.run(['g++', '-o', 't', 'tpcf.cpp', '-std=c++11', '-lm', '-fopenmp'], check=True, stdout=subprocess.PIPE, universal_newlines=True)
c = subprocess.run(['./t'], check=True, stdout=subprocess.PIPE, universal_newlines=True)
print(c.stdout)

## read bin limits file
bin_limits = []
f = open("bin_limits.txt")
l = f.readline()
l = l.strip()
l = l.split()
l = [float(i) for i in l]
bin_limits = l
f.close()

tpcf_vals = []
f = open("tpcf_vals.txt")
l = f.readline()
l = l.strip()
l = l.split()
l = [float(i) for i in l]
tpcf_vals = l
f.close()

## calculate exponential bin width
bin_width = log(bin_limits[3], 10) - log(bin_limits[2], 10)
bin_width = round(bin_width, 4)

bin_means = []
for i in range(len(bin_limits) - 1):
	bin_means.append(i*bin_width + bin_width/2)

bin_means = [10**i for i in bin_means]

print("Bin Means:")
print(bin_means)
print()
print("Correlation values:")
print(tpcf_vals)
print()

plt.title("Two Point Correlation Function")
plt.plot(bin_means, tpcf_vals, ls='none', marker='o', color='blue')
plt.ylabel(r'$\xi(r)$')
plt.xlabel("Distance (r)")
plt.yscale('log')
plt.xscale('log')
plt.savefig("tpcf_plot.png", format='png')
## plt.show()
plt.close()





