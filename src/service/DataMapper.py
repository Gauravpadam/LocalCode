# A layer to map data before Service -> Persistence AND Persistence -> Service

# Now: I need a mapper for mapping testcases to and from persistence storage
# Edit: I just defused the need for now by standardizing tc format to

# {
#     "input": {
#         "params": {
#             "foo": {
#                 "type": "string",
#                 "value": "bar"
#             },
#             "nums": {
#                 "type": "list",
#                 "value": "[4, 5, 6]"
#             },
#             "target": {
#                 "type": "integer",
#                 "value": 9
#             }
#         },
#         "notes": "foo"
#     },
#     "expected_output": {
#         "type": "string",
#         "value": "I need some coffee."
#     }
# }

# Now now: I would need to parse the data structures for different languages.

# import json

# class DataMapper:

#     @classmethod
#     def map


# from typing import List
# from decimal import Decimal


# class DataMapper:

#     @staticmethod
#     def produce_array(array_like: str):
#         array: List[int]  = list(map(int, array_like.lstrip('[').rstrip(']').split(',')))
#         return array
    
#     @staticmethod
#     def produce_int(int_like: str):
#         integer = int(int_like)
#         return integer
    
#     @staticmethod
#     def produce_float(float_like: str):
#         floatval: float = float(float_like)
#         return floatval
    
#     @staticmethod
#     def produce_double(double_like: str):
#         return Decimal(double_like)



        
