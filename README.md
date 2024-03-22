# Renovation Agency API


## Tasks:

 - Prepare models in schema.prisma file: [Done]
  * User, [✔️]
  * Contractor, [✔️]
  * Building, [✔️]
  * Booking [✔️]
 - Create user crud module with: [Done]
  * login, [✔️]
  * registration, [✔️]
  * update user, [✔️]
  * remove user [✔️]
 - Create: [Done] 
  * user Authentication using JwtService, [✔️]
  * set as default block access to endpoints by unauthenticated users, [✔️]
  * create custom @Public decorator, [✔️]
  * registration and login set as Public [✔️]

 - Create building module with: [Done]
  * creating new advertisment with buildings to renovate, [✔️]
  * Patch request to update the advertisment, [✔️]
  * Delete request to remove advertisment [✔️]
  
 - Create get all Buildings endpoint, set it as Public [✔️]
 - List with buildings can be filtered by: [✔️]
  * estimated cost, [✔️]
  * estimated area, [✔️]
  * city, [✔️]
  * zip-code, [✔️]
  * deadline
 - Make reservation for buildings only by constructors
 - top 5 contractors with the greatest number of bookings
 - top 5 contractors with the greatest number of upcoming bookings (don't count any past bookings)
 - top 5 buildings with upcoming bookings
 - storing images uploaded by users showing state of building
 
## Ideas:
 - user can set an opinion about constructor job
 - users can review constructors and theirs opinions
 - make role admin, he has access to update/delete all elements in app
 - user can open chat with contractor and vice versa

