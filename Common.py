def PrintList(name, listToPrint):
    print('-' * 80)
    print(f'{name} ({len(listToPrint)}):')

    if not listToPrint:
        print('(Empty)')
        return

    for item in listToPrint:
        print(item)