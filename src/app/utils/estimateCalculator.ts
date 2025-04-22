interface RoomSizeEstimate {
  minSqFt: number;
  maxSqFt: number;
}

interface TimeEstimate {
  twoPersonHours: string;
  threePersonHours: string;
  fourPersonHours: string;
}

// Mapping of number of rooms to approximate square footage
const roomToSqFtMap: Record<number, RoomSizeEstimate> = {
  1: { minSqFt: 0, maxSqFt: 800 },      // Studio/1 bedroom
  2: { minSqFt: 800, maxSqFt: 1000 },   // 2 bedrooms
  3: { minSqFt: 1000, maxSqFt: 1500 },  // 3 bedrooms
  4: { minSqFt: 1500, maxSqFt: 2000 },  // 4 bedrooms
  5: { minSqFt: 2001, maxSqFt: 3000 },  // 5 bedrooms
  6: { minSqFt: 3000, maxSqFt: 4000 },  // 6 bedrooms
  7: { minSqFt: 4000, maxSqFt: 5000 }   // 7+ bedrooms
};

// Square footage to hours estimate mapping
const sqFtToHoursMap: Record<string, TimeEstimate> = {
  'under800': {
    twoPersonHours: '2',
    threePersonHours: '2',
    fourPersonHours: 'N/A'
  },
  '800-1000': {
    twoPersonHours: '2',
    threePersonHours: '2',
    fourPersonHours: 'N/A'
  },
  '1000-1500': {
    twoPersonHours: '3',
    threePersonHours: '2-3',
    fourPersonHours: '2'
  },
  '1500-2000': {
    twoPersonHours: '4',
    threePersonHours: '3-4',
    fourPersonHours: '2-3'
  },
  '2001-3000': {
    twoPersonHours: '6',
    threePersonHours: '4-5',
    fourPersonHours: '3-4'
  },
  '3000-4000': {
    twoPersonHours: '6-8',
    threePersonHours: '5-6',
    fourPersonHours: '4-5'
  },
  '4000+': {
    twoPersonHours: '10+',
    threePersonHours: '8-10',
    fourPersonHours: '6-8'
  }
};

// Distance to truck time estimates
const carryDistanceMap: Record<string, string> = {
  'under20': '0',
  '20-50': '0.5-1',
  '50plus': '1-2'
};

// Drive time estimates
const driveTimeMap: Record<string, string> = {
  '10-40': '0.5',
  '40-75': '1-2',
  '75-100': '2-3'
};

interface EstimateParams {
  numberOfRooms: number;
  numberOfMovers: number;
  hasElevator: boolean;
  isElevatorReserved: boolean;
  floor: number;
  carryDistance: 'under20' | '20-50' | '50plus';
  driveDistance?: '10-40' | '40-75' | '75-100';
}

export function calculateMoveEstimate(params: EstimateParams): {
  baseHours: string;
  additionalHours: number;
  totalEstimate: string;
  breakdown: string[];
} {
  const {
    numberOfRooms,
    numberOfMovers,
    hasElevator,
    isElevatorReserved,
    floor,
    carryDistance,
    driveDistance
  } = params;

  // Get square footage estimate from number of rooms
  const sqFtEstimate = roomToSqFtMap[numberOfRooms] || roomToSqFtMap[7]; // Use 7+ for larger homes
  
  // Determine which square footage range to use
  let sqFtRange = 'under800';
  if (sqFtEstimate.maxSqFt > 4000) sqFtRange = '4000+';
  else if (sqFtEstimate.maxSqFt > 3000) sqFtRange = '3000-4000';
  else if (sqFtEstimate.maxSqFt > 2000) sqFtRange = '2001-3000';
  else if (sqFtEstimate.maxSqFt > 1500) sqFtRange = '1500-2000';
  else if (sqFtEstimate.maxSqFt > 1000) sqFtRange = '1000-1500';
  else if (sqFtEstimate.maxSqFt > 800) sqFtRange = '800-1000';

  // Get base hours for the move
  const timeEstimate = sqFtToHoursMap[sqFtRange];
  let baseHours = '0';
  switch(numberOfMovers) {
    case 2:
      baseHours = timeEstimate.twoPersonHours;
      break;
    case 3:
      baseHours = timeEstimate.threePersonHours;
      break;
    case 4:
      baseHours = timeEstimate.fourPersonHours;
      break;
  }

  const breakdown: string[] = [];
  let additionalHours = 0;

  // Add carry distance time
  const carryTime = carryDistanceMap[carryDistance];
  if (carryTime !== '0') {
    additionalHours += parseFloat(carryTime.split('-')[0]);
    breakdown.push(`Carry distance (${carryDistance} ft): +${carryTime} hours`);
  }

  // Add drive time if applicable
  if (driveDistance) {
    const driveTime = driveTimeMap[driveDistance];
    additionalHours += parseFloat(driveTime.split('-')[0]);
    breakdown.push(`Drive time (${driveDistance} miles): +${driveTime} hours`);
  }

  // Calculate stairs/elevator time
  if (floor > 1) {
    if (hasElevator) {
      if (!isElevatorReserved) {
        additionalHours += 0.5;
        breakdown.push('Elevator (not reserved): +0.5 hours');
      }
    } else {
      const stairHours = floor - 1; // 1 hour per flight of stairs
      additionalHours += stairHours;
      breakdown.push(`Stairs (${floor - 1} flights): +${stairHours} hours`);
    }
  }

  // Calculate total estimate
  const baseHoursNum = parseFloat(baseHours.split('-')[0].replace('+', ''));
  const totalHours = baseHoursNum + additionalHours;
  
  return {
    baseHours,
    additionalHours,
    totalEstimate: `${totalHours}${totalHours === Math.floor(totalHours) ? '' : '.5'}`,
    breakdown
  };
} 