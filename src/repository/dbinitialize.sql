create schema if not exists localcode;

create table if not exists localcode.users(
    _id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(18) NOT NULL,
    salt text;
);

INSERT into localcode.users(username, email, password)
VALUES ('architect', 'architect@localcode.com', 'architect');

create table if not exists localcode.problems(
    _id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description text default NULL,
    submitted_by int REFERENCES localcode.users,
    testcase_id int default null,
    slug VARCHAR(200) unique NOT NULL
);

create table if not exists localcode.testcases(
    _id SERIAL,
    problem_id int REFERENCES localcode.problems,
    submitted_by int REFERENCES localcode.users,
    slug VARCHAR(200),
    testcase json not null,
    PRIMARY KEY(_id, problem_id)
);

ALTER table localcode.problems
add constraint FK_testcase_id
foreign key(testcase_id, _id) references localcode.testcases(_id, problem_id);

INSERT into localcode.problems(title, description, submitted_by, testcase_id, slug)
VALUES('Two Sum','The two sum problem', 1, null, 'two-sum');

INSERT into localcode.testcases(problem_id, submitted_by, slug, testcase)
VALUES(1, 1, 'two-sum', '{"input": {"params": {"nums": {"type": "list", "value": [2, 7, 11, 15]}, "target": {"type": "integer", "value": 9}}}, "expected_output": {"_output": {"type": "list", "value": [1,0]}}}');

update localcode.problems ctp
SET testcase_id = 1 where
ctp._id = 1;

create table if not exists localcode.submissions(
    _id SERIAL PRIMARY KEY,
    problem_id int REFERENCES localcode.problems,
    submitted_by int REFERENCES localcode.users,
    code text NOT NULL,
    slug text not null,
    runtime float default NULL,
    space float default NULL,
    attempt int default 1,
    is_solution bool default FALSE
);

insert into localcode.submissions(problem_id, submitted_by, code, slug, runtime, space, is_solution)
VALUES(1, 1, 'class Solution: \n\tdef two_sum(self, nums: List[int], target: int: \n\t\t hm = defaultdict(int) \n for i in range(len(nums)): \n\t\t\t
complement = target - nums[i] \n  if complement in hm: \n\t\t\t\t return [i, hm[complement]] \n hm[nums[i]] = i', 'two-sum', 1.0, 10.0, TRUE);
