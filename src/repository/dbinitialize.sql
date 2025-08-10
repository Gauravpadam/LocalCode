create schema if not exists cheetcode;

create table if not exists cheetcode.users(
    _id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(18) NOT NULL,
);

INSERT into cheetcode.users
VALUES ('architect',
'architect@cheetcode.com',
'architect');

create table if not exists cheetcode.problems(
    _id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description text default NULL,
    submitted_by int REFERENCES cheetcode.users,
    testcase_id int default NULL,
    slug VARCHAR(200) unique NOT NULL
);

INSERT into cheetcode.problems
VALUES('Two Sum','The two sum problem', 1);

create table if not exists cheetcode.testcases(
    _id SERIAL,
    problem_id int REFERENCES cheetcode.problems,
    input text NOT NULL,
    expected_output text NOT NULL,
    submitted_by int REFERENCES cheetcode.users,
    PRIMARY KEY(_id, problem_id)
);

INSERT into cheetcode.testcases
VALUES (1, '2,7,11,15', '0,1', 1);

ALTER table cheetcode.problems
add constraint FK_testcase_id
foreign key(testcase_id, problem_id) references cheetcode.testcases(_id, problem_id);

update cheetcode.problems ctp
SET testcase_id = 1 where
ctp._id = 1

create table if not exists cheetcode.submissions(
    _id SERIAL PRIMARY KEY,
    problem_id int REFERENCES cheetcode.problems,
    submitted_by int REFERENCES cheetcode.users,
    code text NOT NULL,
    runtime float default NULL,
    space float default NULL,
    attempt int default 1,
    is_solution bool default NULL
);

insert into cheetcode.submissions(problem_id, submitted_by, code, runtime, space, is_solution)
VALUES(1, 1, 'class Solution: \n\tdef two_sum(self, nums: List[int], target: int: \n\t\t hm = defaultdict(int) \n for i in range(len(nums)): \n\t\t\t
complement = target - nums[i] \n  if complement in hm: \n\t\t\t\t return [i, hm[complement]] \n hm[nums[i]] = i', 1.0, 10.0, TRUE)
