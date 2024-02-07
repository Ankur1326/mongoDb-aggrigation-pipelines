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


// 8. How many users have 'enim' as one of their tags?
[
  {
    $match: {
      tags: "enim",
    },
  },
  {
    $count: 'userWithEnim'
  }
]


// 9. What are the names and age of users who are inactive and have 'velit' as a tag?
[
  {
    $match: {
      isActive: false,
      tags: "velit"
    },
  },
  {
    $project: {
      name: 1,
      age: 1
    }
  }
]


// 10. How many users have a phone number starting with '+1 (940)'?
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/
    }
  },
  {
    $count: 'usersWithSpecialPhoneNumber'
  }
]


// 11. Who has registered the most recently?
[
  {
    $sort: {
      registered: -1
    }
  },
  {
    $limit: 4
  },
  {
    $project: {
      name: 1,
      registered: 1,
      favoriteFruit: 1
    }
  }
]


// 12. Categorize users by their favorite fruit
[
  {
    $group: {
      _id: "$favoriteFruit",
      users: { $push: "$name" }
    }
  }
]

// 13. How many users have 'ad' as the second tag in their list of tags?
[
  {
    $match: {
      "tags.1": "ad"
    }
  },
  {
    $count: 'secondTagAd'
  }
]


// 14. Find the who have both 'enim' and 'id' as their tags.
[
  {
    $match: {
      "tags": { $all: ["enim", "id"] }
    }
  }
]


// 15. List all companies located in the USA with their corresponding user count?
[
  {
    $match: {
      "company.location.country": "USA"
    }
  },
  {
    $group: {
      _id: null,
      userCount: { $sum: 1 }
    }
  }
]


// lookup 
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: {
        $first: "$author_details"
      }
    }
  }
]

// or 
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ["$author_details", 0]
      }
    }
  }
]