## simple plotter that reads bin_limits.txt and tpcf_vals.txt and produces a pdf plot
## Justin Clarke

import matplotlib.pyplot as plt
from math import log

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


## print("Bin limits:")
## print(str(bin_limits))
## print("len bin limits")
## print(len(bin_limits))
## print(" ")
## print("tpcf values:")
## print(str(tpcf_vals))
## print(" ")

## calculate exponential bin width
bin_width = log(bin_limits[3], 10) - log(bin_limits[2], 10)
bin_width = round(bin_width, 4)

bin_means = []
for i in range(len(bin_limits) - 1):
	bin_means.append(i*bin_width + bin_width/2)

bin_means = [10**i for i in bin_means]


## print("bin means")
## print(str(bin_means))



plt.title("Two Point Correlation Function")
plt.plot(bin_means, tpcf_vals, ls='none', marker='o', color='blue')
plt.ylabel(r'$\xi(r)$')
plt.xlabel("Distance (r)")
plt.yscale('log')
plt.xscale('log')
#plt.axis([10**-4, 1, 10**-3, 15])
plt.savefig("tpcf_plot.pdf", format='pdf')
plt.show()
plt.close()










