import os
import boto3


def handler(event, context):
    path  = event['rawPath']
    if path != '/':
        return {
            'statusCode': 404,
            'body': 'Not Found'
        }   

    dynamodb = boto3.resource('dynamodb')
    table = os.environ.get('TABLE_NAME')
    
    response = table.get_item(Key = {'key': 'visit_count'})
    if 'Item' in response:
        visit_count = response['Item']['value']

    else:
        visit_count = 0

    new_visit_count = visit_count + 1
    table.put_item(Item = {'key': 'visit_count', 'value': new_visit_count})

    response_body = {

        'message': 'Hello, World! ',
        'version': '1.0.0',
        'visit_count': new_visit_count
    }
    return {
        'statusCode': 200,
        'body': response_body
    }