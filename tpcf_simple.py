## simple and ugly version of the two-point correlation function calculator
## Justin Clarke

import matplotlib.pyplot as plt
import random
import time

multiplier = 1

# read in data coordinates
fl = "test_coords.txt"
f = open(fl)
coord_lst = []
for iline in f:
	l = iline.strip()
	l = l.split()
	l = [float(i) for i in l]
	coord_lst.append(l)

#generate random coords
rand_coord_lst = [[random.uniform(0, 100), random.uniform(0, 100), random.uniform(0, 100)]   for i in range(len(coord_lst) * multiplier)]

#x = [i[0] for i in rand_coord_lst]
#y = [i[1] for i in rand_coord_lst]
#plt.title("Random Coordinates")
#plt.plot(x, y, ls='none', marker='.', color='green')
#plt.show()
#plt.close()

def dist(coord1, coord2):
	x1 = coord1[0]
	x2 = coord2[0]
	y1 = coord1[1]
	y2 = coord2[1]
	z1 = coord1[2]
	z2 = coord2[2]
	d = ((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2)**.5
	return d


bin_limits = [0, 10**0.2, 10**0.4, 10**0.6, 10**0.8, 10, 10**1.2, 10**1.4, 10**1.6, 10**1.8, 10**2]
DD_bin_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
DR_bin_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
RR_bin_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

# start timer
start = time.time()

## find DD counts
print("Finding DD counts")
for i in coord_lst:
	for j in coord_lst:
		d = dist(i, j)
		if d > 0:
			k = 1
			while k < 11:
				if d > bin_limits[k - 1] and d <= bin_limits[k]:
					DD_bin_counts[k - 1] += 1
					k = 12
				k += 1


## find DR counts
print("Finding DR counts")
for i in coord_lst:
	for j in rand_coord_lst:
		d = dist(i, j)
		if d > 0:
			k = 1
			while k < 11:
				if d > bin_limits[k - 1] and d <= bin_limits[k]:
					DR_bin_counts[k - 1] += 1
					k = 12
				k += 1


## find RR counts
print("Finding RR counts")
for i in rand_coord_lst:
	for j in rand_coord_lst:
		d = dist(i, j)
		if d > 0:
			k = 1
			while k < 11:
				if d > bin_limits[k - 1] and d <= bin_limits[k]:
					RR_bin_counts[k - 1] += 1
					k = 12
				k += 1

tpcf_vals = []
nr = len(rand_coord_lst)
nd = len(coord_lst)
for i in range(len(DD_bin_counts)):
	DD = DD_bin_counts[i]
	DR = DR_bin_counts[i]
	RR = RR_bin_counts[i]
	if RR == 0:
		tpcf_vals.append(-1)
	else:
		val = (1/RR)*((DD * (nr/nd)**2) - ((2*DR)*(nr/nd)) + RR)
		tpcf_vals.append(val)

# end timer
end = time.time()

print(str(len(coord_lst)) + " data points")
print(str(len(rand_coord_lst)) + " random points")
print(str(end - start) + " seconds")


# plot results
plt.title("Two Point Correlation Function")
plt.plot(bin_limits[1:], tpcf_vals, ls='none', marker='o', color='blue')
plt.xscale('log')
plt.yscale('log')
plt.xlabel("distance")
plt.ylabel("xi(r)")
plt.show()
plt.close()













