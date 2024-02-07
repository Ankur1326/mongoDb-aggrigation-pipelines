// 1. How Many users are active?

[
  {
    $match: {
      isActive: true,
    },
  },
  {
    $count: "activeUser",
  },
]


// 2. What is the avarage age of all users?

[
  {
    $group: {
      _id: null,
      avarageAge: {
        $avg: "$age"
      }
    }
  }
]


// as well as grouping male and female

[
  {
    $group: {
      _id: "$gender",
      avarageAge: {
        $avg: "$age"
      }
    }
  }
]


// 3. List the top 5 most common favorite fruits among the users

[
  { // group the user based on favoriteFruit
    $group: {
      _id: "$favoriteFruit",
      count: { // Here is create count field and sum common fruits
        $sum: 1
      }
    }
  },
  {
    $sort: { // desending or accending order 
      count: -1
    }
  },
  { // give last result 5
    $limit: 5
  }
]


// 4. Find the total number of males and females.
[
  {
    $group: {
      _id: "$gender",
      total: {
        $sum: 1
      }
    },
  }
]


// 5. Which country has the highest number of registered users?
[
  {
    $group: {
      _id: "$company.location.country",
      userCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      userCount: -1
    }
  },
  {
    $limit: 1
  }
]

// 6. List all unique eye colors present in the collection
[
  {
    $group: {
      _id: "$eyeColor"
    }
  }
]


// 7. What is the avarage number of tags per user?
[
  {
    $unwind: {
      path: "$tags",
    }
  },
  {
    $group: {
      _id: "$_id",
      numberOfTags: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: null,
      avarageNumberOfTags: { $avg: "$numberOfTags" }
    }
  }
]

// or second method to get the answer
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: ["$tags", []] }
      }
    }
  },
  {
    $group: {
      _id: null,
      avarageNumberOfTags: { $avg: "$numberOfTags" }
    }
  }
]